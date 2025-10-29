import { Routes } from '@angular/router';
import { IssueListComponent } from './components/issue-list/issue-list.component';
import { IssueDetailComponent } from './components/issue-detail/issue-detail.component';

export const routes: Routes = [
  { path: '', component: IssueListComponent },
  { path: 'issue/:owner/:repo/:number', component: IssueDetailComponent },
  { path: '**', redirectTo: '' }
];
