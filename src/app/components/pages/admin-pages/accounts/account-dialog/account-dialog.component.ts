import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from 'src/app/models/account.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { Action } from 'src/app/utils/interceptor/admin-actions';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})
export class AccountDialogComponent implements OnInit {
  action: Action = Action.ADD;
  account: Account = new Account();
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  usernameFormControl = new FormControl('', [Validators.required]);
  phoneNumberFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  confirmPasswordFormControl = new FormControl('', [Validators.required]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly notificationService: NotificationService,
    public dialogRef: MatDialogRef<AccountDialogComponent>) { }

  ngOnInit(): void {
    this.getPassedData();
  }

  private getPassedData() {
    this.action = this.data.action;
    if (this.action !== Action.ADD) {
      this.account = this.data.account;
    }

    if(this.action === Action.UPDATE) {
      this.emailFormControl.setValue(this.account.email!!);
      this.usernameFormControl.setValue(this.account.userName!!);
      this.phoneNumberFormControl.setValue(this.account.phoneNumber!!);
      this.passwordFormControl.setValue(this.account.password!!);
    }
  }

  addAccount() {
    if (this.passwordFormControl.getRawValue() as string === this.confirmPasswordFormControl.getRawValue() as string) {
      let newAccount: Account = new Account();
      newAccount.email = this.emailFormControl.getRawValue() ?? "";
      newAccount.userName = this.usernameFormControl.getRawValue() ?? "";
      newAccount.phoneNumber = this.phoneNumberFormControl.getRawValue() ?? "";
      newAccount.password = this.passwordFormControl.getRawValue() ?? "";

      this.dialogRef.close({ event: 'Add', data: newAccount });
    } else {
      this.notificationService.showErrorNotification("Entered passwords doesn't match!");
    }
  }

  updateAccount() {
    let newAccount: Account = new Account();
    newAccount.accountId = this.account.accountId;
    newAccount.email = this.emailFormControl.getRawValue() ?? "";
    newAccount.userName = this.usernameFormControl.getRawValue() ?? "";
    newAccount.phoneNumber = this.phoneNumberFormControl.getRawValue() ?? "";
    newAccount.password = this.passwordFormControl.getRawValue() ?? "";
    
    this.dialogRef.close({ event: 'Update', data: newAccount });
  }

  deleteAccount() {
    this.dialogRef.close({ event: 'Delete', data: this.account.accountId })
  }
}