import { RouterLinkPipe } from './router-link.pipe';

describe('RouterLinkPipe', () => {
  it('create an instance', () => {
    const pipe = new RouterLinkPipe(null);
    expect(pipe).toBeTruthy();
  });
});
