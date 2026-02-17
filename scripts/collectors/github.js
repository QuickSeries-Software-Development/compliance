#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG;
const GITHUB_REPOS = process.env.GITHUB_REPOS; // comma-separated, optional
const GITHUB_ENTERPRISE = process.env.GITHUB_ENTERPRISE; // enterprise slug, optional
const EVIDENCE_DATE = process.env.EVIDENCE_DATE || todayISO();

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(ROOT, 'evidence', 'automated', 'github', EVIDENCE_DATE);

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function envelope(check, org, repos, summary, data) {
  return {
    collected_at: new Date().toISOString(),
    source: 'github',
    check,
    org,
    repos_audited: repos,
    summary,
    data,
  };
}

function writeResult(filename, payload) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const filepath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(payload, null, 2) + '\n');
  console.log(`    Saved ${path.relative(ROOT, filepath)}`);
}

// ---------------------------------------------------------------------------
// Repo discovery
// ---------------------------------------------------------------------------

async function discoverRepos(octokit, org) {
  if (GITHUB_REPOS) {
    return GITHUB_REPOS.split(',').map((r) => r.trim()).filter(Boolean);
  }

  console.log('  Discovering repos in org...');
  const repos = await octokit.paginate(octokit.repos.listForOrg, {
    org,
    type: 'all',
    per_page: 100,
  });

  return repos
    .filter((r) => !r.archived)
    .map((r) => r.name)
    .sort();
}

// ---------------------------------------------------------------------------
// Check 1: Branch Protection Rules
// ---------------------------------------------------------------------------

async function collectBranchProtection(octokit, org, repos) {
  const data = {};
  let protectedCount = 0;
  let unprotectedCount = 0;

  async function checkBranch(octokit, org, repo, branch) {
    try {
      const { data: protection } = await octokit.repos.getBranchProtection({
        owner: org,
        repo,
        branch,
      });
      return {
        branch,
        protected: true,
        required_pull_request_reviews: protection.required_pull_request_reviews
          ? {
              required_approving_review_count:
                protection.required_pull_request_reviews.required_approving_review_count || 0,
              dismiss_stale_reviews:
                protection.required_pull_request_reviews.dismiss_stale_reviews || false,
              require_code_owner_reviews:
                protection.required_pull_request_reviews.require_code_owner_reviews || false,
            }
          : null,
        required_status_checks: protection.required_status_checks
          ? {
              strict: protection.required_status_checks.strict || false,
              contexts: protection.required_status_checks.contexts || [],
            }
          : null,
        enforce_admins: protection.enforce_admins
          ? protection.enforce_admins.enabled
          : false,
        restrictions: protection.restrictions
          ? {
              users: (protection.restrictions.users || []).map((u) => u.login),
              teams: (protection.restrictions.teams || []).map((t) => t.slug),
            }
          : null,
      };
    } catch (err) {
      if (err.status === 404) {
        return { branch, protected: false, reason: 'No branch protection configured' };
      }
      throw err;
    }
  }

  for (const repo of repos) {
    try {
      const { data: repoData } = await octokit.repos.get({ owner: org, repo });
      const defaultBranch = repoData.default_branch;

      // Always check the default branch
      const branches = [defaultBranch];

      // Also check main/master if they're not the default branch
      for (const important of ['main', 'master']) {
        if (important !== defaultBranch) {
          try {
            await octokit.repos.getBranch({ owner: org, repo, branch: important });
            branches.push(important);
          } catch (_) {
            // Branch doesn't exist, skip
          }
        }
      }

      const branchResults = {};
      let repoProtected = false;
      for (const branch of branches) {
        branchResults[branch] = await checkBranch(octokit, org, repo, branch);
        if (branchResults[branch].protected) repoProtected = true;
      }

      data[repo] = {
        default_branch: defaultBranch,
        branches_checked: branches,
        branches: branchResults,
      };

      if (repoProtected) protectedCount++;
      else unprotectedCount++;
    } catch (err) {
      data[repo] = { error: err.message, status: err.status || null };
    }
  }

  const summary = {
    total_repos: repos.length,
    protected: protectedCount,
    unprotected: unprotectedCount,
    errors: repos.length - protectedCount - unprotectedCount,
  };

  writeResult('branch-protection.json', envelope('branch-protection', org, repos, summary, data));
  return summary;
}

// ---------------------------------------------------------------------------
// Check 2: Merged PRs with Reviews
// ---------------------------------------------------------------------------

async function collectPRReviews(octokit, org, repos) {
  const data = {};
  let totalMerged = 0;
  let totalWithReview = 0;

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceISO = since.toISOString();

  for (const repo of repos) {
    try {
      // Get recently merged PRs
      const pulls = await octokit.paginate(octokit.pulls.list, {
        owner: org,
        repo,
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
      });

      const mergedPRs = pulls.filter(
        (pr) => pr.merged_at && new Date(pr.merged_at) >= since
      );

      const prDetails = [];
      let repoWithReview = 0;
      let repoWithoutReview = 0;

      for (const pr of mergedPRs) {
        const { data: reviews } = await octokit.pulls.listReviews({
          owner: org,
          repo,
          pull_number: pr.number,
        });

        const hasApproval = reviews.some((r) => r.state === 'APPROVED');
        if (hasApproval) {
          repoWithReview++;
        } else {
          repoWithoutReview++;
        }

        prDetails.push({
          number: pr.number,
          title: pr.title,
          author: pr.user.login,
          merged_at: pr.merged_at,
          had_approving_review: hasApproval,
          review_count: reviews.length,
        });
      }

      totalMerged += mergedPRs.length;
      totalWithReview += repoWithReview;

      data[repo] = {
        period_start: sinceISO.split('T')[0],
        merged_count: mergedPRs.length,
        with_review: repoWithReview,
        without_review: repoWithoutReview,
        compliance_rate:
          mergedPRs.length > 0
            ? Math.round((repoWithReview / mergedPRs.length) * 10000) / 100
            : 100,
        pull_requests: prDetails,
      };
    } catch (err) {
      data[repo] = { error: err.message, status: err.status || null };
    }
  }

  const totalWithoutReview = totalMerged - totalWithReview;
  const summary = {
    total_merged: totalMerged,
    with_review: totalWithReview,
    without_review: totalWithoutReview,
    compliance_rate:
      totalMerged > 0
        ? Math.round((totalWithReview / totalMerged) * 10000) / 100
        : 100,
  };

  writeResult('pr-reviews.json', envelope('pr-reviews', org, repos, summary, data));
  return summary;
}

// ---------------------------------------------------------------------------
// Check 3: Org Members and Access
// ---------------------------------------------------------------------------

async function collectOrgMembers(octokit, org, repos) {
  const members = [];
  let adminCount = 0;
  let memberCount = 0;

  try {
    const orgMembers = await octokit.paginate(octokit.orgs.listMembers, {
      org,
      per_page: 100,
    });

    for (const m of orgMembers) {
      try {
        const { data: membership } = await octokit.orgs.getMembershipForUser({
          org,
          username: m.login,
        });

        const role = membership.role; // 'admin' or 'member'
        if (role === 'admin') adminCount++;
        else memberCount++;

        members.push({
          login: m.login,
          role,
          state: membership.state,
          two_factor_enabled: m.two_factor_authentication ?? null,
        });
      } catch (err) {
        members.push({
          login: m.login,
          role: 'unknown',
          error: err.message,
        });
      }
    }
  } catch (err) {
    writeResult(
      'org-members.json',
      envelope('org-members', org, repos, { error: err.message }, { error: err.message })
    );
    return { error: err.message };
  }

  const summary = {
    total_members: members.length,
    admins: adminCount,
    members: memberCount,
  };

  writeResult('org-members.json', envelope('org-members', org, repos, summary, { members }));
  return summary;
}

// ---------------------------------------------------------------------------
// Check 4: Repository Settings
// ---------------------------------------------------------------------------

async function collectRepoSettings(octokit, org, repos) {
  const data = {};
  let publicCount = 0;

  for (const repo of repos) {
    try {
      const { data: repoData } = await octokit.repos.get({ owner: org, repo });

      const isPublic = repoData.visibility === 'public' || !repoData.private;
      if (isPublic) publicCount++;

      data[repo] = {
        visibility: repoData.visibility || (repoData.private ? 'private' : 'public'),
        private: repoData.private,
        default_branch: repoData.default_branch,
        has_wiki: repoData.has_wiki,
        has_issues: repoData.has_issues,
        allow_forking: repoData.allow_forking ?? null,
        delete_branch_on_merge: repoData.delete_branch_on_merge ?? null,
        archived: repoData.archived,
        public_concern: isPublic,
      };
    } catch (err) {
      data[repo] = { error: err.message, status: err.status || null };
    }
  }

  const summary = {
    total_repos: repos.length,
    public_repos: publicCount,
    private_repos: repos.length - publicCount,
    public_concerns: publicCount > 0,
  };

  writeResult('repo-settings.json', envelope('repo-settings', org, repos, summary, data));
  return summary;
}

// ---------------------------------------------------------------------------
// Check 5: Dependabot Alerts
// ---------------------------------------------------------------------------

async function collectDependabotAlerts(octokit, org, repos) {
  const data = {};
  let totalOpen = 0;
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };

  for (const repo of repos) {
    try {
      const alerts = await octokit.paginate(
        'GET /repos/{owner}/{repo}/dependabot/alerts',
        {
          owner: org,
          repo,
          state: 'open',
          per_page: 100,
        }
      );

      const repoSeverity = { critical: 0, high: 0, medium: 0, low: 0 };
      const alertDetails = alerts.map((a) => {
        const sev = a.security_advisory?.severity || 'unknown';
        if (repoSeverity[sev] !== undefined) repoSeverity[sev]++;
        return {
          number: a.number,
          package: a.dependency?.package?.name || null,
          ecosystem: a.dependency?.package?.ecosystem || null,
          severity: sev,
          summary: a.security_advisory?.summary || null,
          created_at: a.created_at,
        };
      });

      totalOpen += alerts.length;
      for (const sev of Object.keys(severityCounts)) {
        severityCounts[sev] += repoSeverity[sev];
      }

      data[repo] = {
        open_alerts: alerts.length,
        by_severity: repoSeverity,
        alerts: alertDetails,
      };
    } catch (err) {
      if (err.status === 403) {
        data[repo] = {
          error: 'Dependabot alerts not enabled or insufficient permissions',
          status: 403,
        };
      } else {
        data[repo] = { error: err.message, status: err.status || null };
      }
    }
  }

  const summary = {
    total_open_alerts: totalOpen,
    by_severity: { ...severityCounts },
  };

  writeResult(
    'dependabot-alerts.json',
    envelope('dependabot-alerts', org, repos, summary, data)
  );
  return summary;
}

// ---------------------------------------------------------------------------
// Check 6: Audit Log
// ---------------------------------------------------------------------------

async function collectAuditLog(octokit, org, repos) {
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceDate = since.toISOString().split('T')[0];

  // Try enterprise endpoint first (if slug provided), then fall back to org endpoint
  const attempts = [];
  if (GITHUB_ENTERPRISE) {
    attempts.push({
      label: 'enterprise',
      request: () => octokit.paginate('GET /enterprises/{enterprise}/audit-log', {
        enterprise: GITHUB_ENTERPRISE,
        per_page: 100,
        include: 'all',
        phrase: `created:>=${sinceDate}`,
      }),
    });
  }
  attempts.push({
    label: 'org',
    request: () => octokit.paginate('GET /orgs/{org}/audit-log', {
      org,
      per_page: 100,
      include: 'all',
      phrase: `created:>=${sinceDate}`,
    }),
  });

  for (const attempt of attempts) {
    try {
      console.log(`    Trying ${attempt.label} audit log endpoint...`);
      const events = await attempt.request();

      const summary = {
        endpoint: attempt.label,
        events_collected: events.length,
        period_start: sinceDate,
        period_end: EVIDENCE_DATE,
      };

      const data = {
        events: events.map((e) => ({
          action: e.action,
          actor: e.actor || e.user || null,
          created_at: e.created_at || e['@timestamp'] || null,
          repo: e.repo || null,
          org: e.org || null,
        })),
      };

      writeResult('audit-log.json', envelope('audit-log', org, repos, summary, data));
      return summary;
    } catch (err) {
      if (err.status === 403 || err.status === 404) {
        console.log(`    ${attempt.label} endpoint returned ${err.status}, trying next...`);
        continue;
      }
      throw err;
    }
  }

  // All attempts failed
  const note = 'Audit log API not accessible. Ensure the token has read:audit_log scope ' +
    'and GITHUB_ENTERPRISE is set to your enterprise slug if using Enterprise Cloud.';
  console.log(`    Note: ${note}`);
  const summary = { skipped: true, reason: note };
  writeResult('audit-log.json', envelope('audit-log', org, repos, summary, { note }));
  return summary;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const CHECKS = [
  { name: 'branch protection rules', fn: collectBranchProtection, file: 'branch-protection.json' },
  { name: 'PR reviews', fn: collectPRReviews, file: 'pr-reviews.json' },
  { name: 'org members and access', fn: collectOrgMembers, file: 'org-members.json' },
  { name: 'repository settings', fn: collectRepoSettings, file: 'repo-settings.json' },
  { name: 'Dependabot alerts', fn: collectDependabotAlerts, file: 'dependabot-alerts.json' },
  { name: 'audit log', fn: collectAuditLog, file: 'audit-log.json' },
];

async function main() {
  // Validate required env vars
  if (!GITHUB_TOKEN) {
    console.error('Error: GITHUB_TOKEN environment variable is required.');
    process.exit(1);
  }
  if (!GITHUB_ORG) {
    console.error('Error: GITHUB_ORG environment variable is required.');
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
    throttle: { enabled: false },
  });

  console.log(`GitHub Evidence Collector`);
  console.log(`  Org:  ${GITHUB_ORG}`);
  console.log(`  Date: ${EVIDENCE_DATE}`);
  console.log(`  Output: ${path.relative(ROOT, OUT_DIR)}/`);
  console.log('');

  // Discover repos
  let repos;
  try {
    repos = await discoverRepos(octokit, GITHUB_ORG);
  } catch (err) {
    console.error(`Error discovering repos: ${err.message}`);
    process.exit(1);
  }

  console.log(`  Repos (${repos.length}): ${repos.join(', ')}`);
  console.log('');

  // Run checks
  const results = [];
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < CHECKS.length; i++) {
    const check = CHECKS[i];
    const label = `[${i + 1}/${CHECKS.length}]`;

    console.log(`${label} Collecting ${check.name}...`);

    try {
      const summary = await check.fn(octokit, GITHUB_ORG, repos);
      results.push({ name: check.name, status: 'ok', summary });
      succeeded++;
    } catch (err) {
      console.error(`    Error: ${err.message}`);
      if (err.status === 429) {
        console.error('    Warning: Rate limit hit. Consider waiting before re-running.');
      }
      results.push({ name: check.name, status: 'error', error: err.message });
      failed++;
    }
  }

  // Summary
  console.log('');
  console.log('--- Collection Summary ---');
  console.log(`  Checks run: ${CHECKS.length}`);
  console.log(`  Succeeded:  ${succeeded}`);
  console.log(`  Failed:     ${failed}`);
  console.log('');

  for (const r of results) {
    const icon = r.status === 'ok' ? 'OK' : 'FAIL';
    console.log(`  [${icon}] ${r.name}`);
    if (r.status === 'error') {
      console.log(`        ${r.error}`);
    }
  }

  console.log('');

  if (succeeded === 0) {
    console.error('All checks failed.');
    process.exit(1);
  }

  console.log(`Evidence saved to ${path.relative(ROOT, OUT_DIR)}/`);
  process.exit(0);
}

main().catch((err) => {
  console.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
