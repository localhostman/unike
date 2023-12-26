import { ValidDatePipe } from './valid-date.pipe';

describe('ValidDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ValidDatePipe();
    expect(pipe).toBeTruthy();
  });
});
