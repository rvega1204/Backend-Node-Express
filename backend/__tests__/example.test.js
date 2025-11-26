describe('Setup Test', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings', () => {
    const text = 'Hello Jest';
    expect(text).toContain('Jest');
  });
});