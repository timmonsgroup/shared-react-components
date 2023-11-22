import { decodeBase64Token, decodeTokenToJWT } from './JWTUtil';

const output = {
  iss: 'https://example.com',
  sub: '1234567890',
  name: 'John Doe',
  iat: 1516239022,
};

test('decodeBase64Token', () => {
  const token = 'eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0=';
  const tokenDecoded = decodeBase64Token(token);
  expect(tokenDecoded).toEqual(output);
});

test('decodeTokenToJWT', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.YECFa8OcsS3qU9z2UksB1reh3XunSzNZYUAHQyfKanM';
  const jwt = decodeTokenToJWT(token);
  expect(jwt).toEqual(output);
});
