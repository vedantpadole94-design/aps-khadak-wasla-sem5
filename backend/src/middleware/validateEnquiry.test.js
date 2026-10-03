const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEnquiry } = require('./validateEnquiry');

const validEnquiry = {
  parentName: '  Parent Name  ',
  studentName: ' Student Name ',
  email: ' PARENT@Example.COM ',
  phone: '1234567890',
  classSeeking: 'I–V',
  message: '  Please contact me.  ',
  source: 'Website'
};

const runValidation = async (body) => {
  const req = { body };
  let response;
  let nextCalled = false;
  const res = {
    status(status) {
      response = { status };
      return this;
    },
    json(payload) {
      response.payload = payload;
      return this;
    }
  };

  await validateEnquiry(req, res, () => { nextCalled = true; });
  return { req, response, nextCalled };
};

test('validateEnquiry accepts and normalizes valid form values', async () => {
  const result = await runValidation({ ...validEnquiry });

  assert.equal(result.nextCalled, true);
  assert.equal(result.response, undefined);
  assert.equal(result.req.body.parentName, 'Parent Name');
  assert.equal(result.req.body.studentName, 'Student Name');
  assert.equal(result.req.body.email, 'parent@example.com');
  assert.equal(result.req.body.message, 'Please contact me.');
});

test('validateEnquiry rejects malformed required fields and unsupported classes', async () => {
  const result = await runValidation({
    ...validEnquiry,
    parentName: 'A',
    email: 'not-an-email',
    phone: 'abc',
    classSeeking: 'XIII'
  });

  assert.equal(result.nextCalled, false);
  assert.equal(result.response.status, 400);
  assert.deepEqual(
    result.response.payload.errors.map((error) => error.field).sort(),
    ['classSeeking', 'email', 'parentName', 'phone']
  );
});

test('validateEnquiry enforces message size and source choices', async () => {
  const result = await runValidation({
    ...validEnquiry,
    message: 'x'.repeat(2001),
    source: 'Unknown'
  });

  assert.equal(result.nextCalled, false);
  assert.equal(result.response.status, 400);
  assert.deepEqual(
    result.response.payload.errors.map((error) => error.field).sort(),
    ['message', 'source']
  );
});
