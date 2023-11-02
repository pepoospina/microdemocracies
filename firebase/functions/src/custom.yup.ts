import * as yup from 'yup';
import { utils } from 'ethers';

// Custom Ethereum account validation
yup.addMethod(yup.string, 'address', function () {
  return this.test('address', 'Invalid Ethereum Address', function (value) {
    const { path, createError } = this;

    const is = utils.isAddress(value);

    if (is) {
      return true;
    }

    // Return an error if validation fails
    return createError({
      path,
      message: `${path} is not a valid Ethereum address`,
    });
  });
});
