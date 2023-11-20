import { Component, OnInit, isDevMode, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../../authentication/services/auth.service';
import { GlobalStoreService } from '../../shared/services/global-store.service';
import { CountDownTime, EMAIL_REGEX } from '../../shared/consts/web.const';
import { countdown } from '../../shared/utils/Util';
import { handleServerValidation } from '../../shared/validation.const';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public isSubmitting!: boolean;
  public submitted!: boolean;
  public form!: FormGroup;
  public error!: string | null;
  public showPassword: boolean = false;
  twoFactorForm!: FormGroup;
  twoFactorAuthenticationEnabled: boolean = false;
  isSubmittingAuthenticationCode: boolean = false;
  prepareResponse: any;
  resendCode: boolean = false;
  countDown!: string;
  countDownTimer!: Subscription;
  disableResendButton: boolean = true;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _as: AuthService,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    public globalService: GlobalStoreService
  ) {
  }

  async ngOnInit() {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      password: ['', [Validators.required]]
    });

    this._as.watchUser().subscribe(x => {
    });
  }

  ngOnDestroy(): void {
    this.countDownTimer?.unsubscribe();
  }

  hasError(control: string, error: string): boolean {
    return this.form.controls[control].hasError(error);
  }

  get f() { return this.form.controls; }


  async onSubmit(model: { email: string, password: string }, isValid: boolean) {
    this.submitted = true;
    if (!isValid) return;

    this.error = null;
    this.isSubmitting = true;

    try {
      // const prepareResponse = await this._as.twoFactorLogin(model.email, model.password);

      let prepareResponse = {
        successful: true,
        isTwoFactor: false
      };

      if (prepareResponse?.successful) {
        if (!prepareResponse.isTwoFactor) {
          this.loginWithout2FactorEnabled(model.email, model.password);
        } else if (prepareResponse.isTwoFactor) {
          this.countDownTimer?.unsubscribe();
          this.countDownTimer = countdown(CountDownTime).subscribe(next => {
            if (this.disableResendButton === next.finished) {
              this.disableResendButton = !next.finished;
            }
            this.countDown = next.display;
            if (next.display === '00:00') {
              this.countDown = '';
            }
          });
          this.prepareResponse = prepareResponse;
          this.twoFactorForm = this._fb.group({
            code: [null, Validators.required]
          });
          this.twoFactorAuthenticationEnabled = true;
        }
      }
    } catch (e: any) {
      this.isSubmitting = false;
      this.error = handleServerValidation(e);
    }
  }

  /**
   * Show or hide password based on what user wants
   */
  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Fires after 2-factor authentication
   * @param email user email
   * @param password user password
   */
  async loginWithout2FactorEnabled(email: string, password: string) {
    try {
      const user = await this._as.login(email, password);
      this.isSubmitting = false;
    } catch (e: any) {
      this.error = handleServerValidation(e);
    }
  }

  /**
   * Fires after 2-factor authentication
   * @param email user email
   * @param password user password
   */
  async login2FactorUser(email: string, password: string) {
    try {
      await this._as.login2FactorEnabledUser(email, password, this.prepareResponse);
      const redirectTo = this._route.snapshot.queryParams['redirectTo'];
      redirectTo ? this._router.navigateByUrl(redirectTo) : this._router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error = handleServerValidation(e);
    }
  }

  /**
   *
   * @param model authentication code
   * @param isValid boolean
   * @returns logged in user
   */
  async onSubmitAuthenticationCode(model: { code: string }, isValid: boolean) {
    if (!isValid) return;

    this.error = null;
    this.isSubmittingAuthenticationCode = true;
    this.prepareResponse['code'] = model.code;
    try {
      const email = this.form.get('email')!.value;
      const password = this.form.get('password')!.value
      // await this.accountsService.verifyCode({code: model.code}).toPromise();
      await this.login2FactorUser(email, password);
      // this.login2FactorUser(email, password);
    } catch (e: any) {
      this.isSubmitting = false;
      this.error = handleServerValidation(e);
      // todo: better error messages.
    } finally {
      this.isSubmittingAuthenticationCode = !this.isSubmittingAuthenticationCode;
    }
  }

  /**
   * Resend verification code for authentication
   */
  async resendVerificationCode() {
    this.resendCode = !this.resendCode;
    const email = this.form.get('email')!.value;
    const password = this.form.get('password')!.value
    try {
      await this.onSubmit({ email, password }, true);
      this.snack.open('New code sent successfully.');
    }
    catch (err: any) {
      this.snack.open(handleServerValidation(err));
    } finally {
      this.resendCode = !this.resendCode;
    }
  }

  onCodeChanged(code: any) {
    if (code.length < 6) {
      this.error = null;
      this.twoFactorForm.controls['code'].patchValue(null);
    }
  }

  // this called only if user entered full code
  onCodeCompleted(code: Event) {
    this.twoFactorForm.controls['code'].patchValue(code);
  }
}
