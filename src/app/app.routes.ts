import { Routes } from '@angular/router';
import { IssueListComponent } from './components/issue-list/issue-list.component';
import { IssueDetailComponent } from './components/issue-detail/issue-detail.component';
import { UserCommitsComponent } from './components/user-commits/user-commits.component';
import { RepoStatsComponent } from './components/repo-stats/repo-stats.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsComponent } from './components/terms/terms.component';
import { UserCompareComponent } from './components/user-compare/user-compare.component';

export const routes: Routes = [
  { path: '', component: IssueListComponent },
  { path: 'commits', component: UserCommitsComponent },
  { path: 'repo-stats', component: RepoStatsComponent },
  { path: 'compare', component: UserCompareComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'issue/:owner/:repo/:number', component: IssueDetailComponent },
  { path: '**', redirectTo: '' }
];
