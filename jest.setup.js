require('@testing-library/jest-dom');

// Mock de fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Reset des mocks avant chaque test
beforeEach(() => {
  jest.clearAllMocks();
});
