import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup } from "@angular/forms";

const standardErrorMessage = 'An error occurred, please try again.';
export function handleServerValidation(response: HttpErrorResponse, form?: FormGroup): string {
    const isHttp = !!response.url;
    if (!isHttp) {
        return response.message;
    }

    if (!response || !response.error) {
        return standardErrorMessage;
    }

    // Identity error models.
    if (response.error && response.error.error_description) {
        return response.error.error_description;
    }

    const content = typeof (response.error) === 'string' ? JSON.parse(response.error) : response.error;

    if (content.errors && form) {
        // todo: apply field errors to form
    }
    // todo: apply field errors to properties in form!

    let errorMessage = response.error.message;
    if (typeof (response.error) === 'string' && response.error.length > 0 && response.error[0] === '{') {
        errorMessage = JSON.parse(response.error).message;
    }
    return errorMessage || standardErrorMessage;
}