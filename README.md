# INVOICE APP #

Ionic application for generating simple invoices, print them and store them to a given device (local storage, no cloud
storage).

Application under the Ionic framework with Angular.

Thinked for tablet size devices.

# Launch #

use `` ionic serve ``

# Notes #

The application enables internalization for French, English and Chinese. (The english option is not accesible yet but
the language file is ready.)

The application uses the Ionic Angular Storage package.

There is a file named file-config-products.json loacted in assets folder which permits to load some products' value at
start. (also the tax is included, view file-config-products-example.json for example).

All the printed invoices will be in French, the others languages are only for the users' comfort when creating invoices.

You can get the data stored in the device in the options, you can insert some data (JSON format) in the options (
duplicated invoices will not be saved).

The application for the € currency.
