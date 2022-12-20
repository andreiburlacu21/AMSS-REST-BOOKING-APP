import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Account } from 'src/app/models/account.model';
import { Role } from 'src/app/models/role';
import { AccountService } from 'src/app/services/account-service/account.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { Action } from 'src/app/utils/interceptor/admin-actions';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})

export class AccountsComponent implements OnInit {
  isLoading: boolean = false;
  accounts: Account[] = [];
  displayedColumns: string[] = ["Username", "Email", "Password", "Phone Number", "Role"];

  constructor(private readonly accountService: AccountService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllAccounts();
  }

  private getAllAccounts() {
    this.accounts = [];

    this.accounts.push({
      accountId: 1,
      userName: "andrei",
      password: "pass123",
      email: "andreiburlacu@gmail.com",
      phoneNumber: "0756514773",
      role: Role.Admin
    });

    this.accounts.push({
      accountId: 2,
      userName: "marian",
      password: "pass123",
      email: "marianlucian@gmail.com",
      phoneNumber: "0756514773",
      role: Role.User
    });


    // this.isLoading = true;
    // this.accountService.getAllAccounts().subscribe({
    //   next: resp => {
    //     this.accounts = resp;
    //     this.isLoading = false;
    //   },
    //   error: () => {
    //     this.notificationService.showErrorNotification("There was an error while loading existing accounts!");
    //     this.isLoading = false;
    //   }
    // });
  }

  addAccount() {
    let dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '500px',
      data: {
        action: Action.ADD
      }
    })

    dialogRef.afterClosed().subscribe(newAccount => {
      if (newAccount.data) {
        this.accountService.addAccount(newAccount.data).subscribe(resp => {
          this.notificationService.showSuccessNotification("Account added!");
          this.getAllAccounts();
        });
      }
    });
  }

  editAccount(account: Account) {
    let dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '500px',
      data: {
        action: Action.UPDATE,
        account: account
      }
    })

    dialogRef.afterClosed().subscribe(updatedAccount => {
      if(updatedAccount.data) {
        this.accountService.updateAccount(updatedAccount.data).subscribe(resp => {
          if(resp) {
            this.notificationService.showSuccessNotification("Account updated!");
            this.getAllAccounts();
          }
        });
      }
    });
  }

  deleteAccount(account: Account) {
    let dialogRef = this.dialog.open(AccountDialogComponent, {
      data: {
        action: Action.DELETE,
        account: account
      }
    })

    dialogRef.afterClosed().subscribe(accountId => {
      if(accountId.data) {
        this.accountService.deleteAccount(accountId.data).subscribe(resp => {
          if(resp) {
            this.notificationService.showSuccessNotification("Account deleted!");
            this.getAllAccounts();
          }
        });
      }
    });
  }
}