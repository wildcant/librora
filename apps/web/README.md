## Getting Started

## Tips

About cloudinary unsigned upload

- [We must enable the option in the cloudinary settings page](https://console.cloudinary.com/settings/c-588ab6a13f88a2d12acf7f86e33807/upload) See [docs](https://cloudinary.com/documentation/upload_images#generating_authentication_signatures)
- [Check the cloudinary postman](https://www.postman.com/cloudinaryteam/workspace)
- Upload preset must be specified when using unsigned upload See [Api reference](https://cloudinary.com/documentation/image_upload_api_reference)

### TODOs

- [ ] Hide auth only pages.
- [ ] Reservation pages.
- [ ] Add server side pagination pages with tables.
- [ ] Reservation flow, status transitions, lender/borrower actions in res tables.

### Issues

Check https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189, currently having the issue in hooks after importing lodash.
