/**
 * @param {Object} body - Body to check fields in
 * @param {String[]} fields - Required keys of body to validate
 * @param {{
 * [key: string]: (value: any) => boolean}} customValidators - Extra validators for some fields which will receive value from the body
 *
 * @returns {String[] | null} Array of required fields which don't match the validation else null
 *
 * @example
 * const body = { email: 'foo@bar.com', password: 'foo@123', age: 30, pictures: ['https://example.com/example.png']};
 *
 * const fields = ['email', 'password', 'pictures'];
 *
 * const customValidators = {
 *      pictures: Array.isArray,
 *      password: (value) => {
 *          if (!(value.includes('@') || value.length > 7)) return false;
 *          return true;
 *      }
 *  };
 *
 */
export default (body, fields, customValidators = null) => {
	if (Array.isArray(body) || !(typeof body === 'object'))
		throw new Error('Body must be an object');

	if (
		!Array.isArray(fields) ||
		fields.every(value => typeof value === 'string')
	)
		throw new Error('Fields must be an array of strings.');

	if (
		customValidators &&
		(Array.isArray(customValidators) || !(typeof customValidators === 'object'))
	)
		throw new Error('Custom validators must an object.');
	const requiredFields = [];

	for (const field of fields) {
		if (!(field in body == null)) {
			requiredFields.push(field);
			continue;
		}

		const validator = customValidators[field];
		if (!validator) continue;

		if (!(typeof validator === 'function'))
			throw new Error('Custom validator must be a function.');

		try {
			if (!validator(body[field])) requiredFields.push(field);
		} catch (error) {
			throw new Error(error.message);
		}
	}
};
