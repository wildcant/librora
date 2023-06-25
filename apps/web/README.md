## Getting Started

## Tips

About cloudinary unsigned upload

- [We must enable the option in the cloudinary settings page](https://console.cloudinary.com/settings/c-588ab6a13f88a2d12acf7f86e33807/upload) See [docs](https://cloudinary.com/documentation/upload_images#generating_authentication_signatures)
- [Check the cloudinary postman](https://www.postman.com/cloudinaryteam/workspace)
- Upload preset must be specified when using unsigned upload See [Api reference](https://cloudinary.com/documentation/image_upload_api_reference)

### TODOs

- [ ] Add server side pagination pages with tables.
- [ ] Reservation flow, status transitions, lender/borrower actions in res tables.

Res flow:

Pending: The initial status when a borrower submits a reservation request.
Possible transitions:
-> Cancelled: The borrower cancels the reservation.
-> Declined: The lender declines the reservation request.
-> Expired: The reservation request expires if the lender doesn't respond within a certain time frame (24-hour window).
-> Confirmed: The lender accepts the reservation request.

Cancelled
Possible transitions: None. The reservation remains in the cancelled state.

Declined
Possible transitions: None. The reservation remains in the declined state.

Expired
Possible transitions: None. The reservation remains in the expired state.

Confirmed
Possible transitions:
#? -> Cancelled: The lender or borrower cancels the reservation.
-> Borrowed: The borrower has borrowed the book.

Borrowed
Possible transitions:
-> Returned: The borrower returns the book to the lender.
-> Late: The borrower has not returned the book after the defined end date.

Late
Possible transitions:
-> Returned: The borrower returns the book to the lender.

Returned
Possible transitions:
-> Reviewed: The borrower reviews their borrowing experience.

Reviewed
Possible transitions: None. The reservation remains in the reviewed state.

### Issues

Check https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189, currently having the issue in hooks after importing lodash.
