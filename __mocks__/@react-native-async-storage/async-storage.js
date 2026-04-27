const store = {};

const AsyncStorage = {
  setItem: jest.fn(async (key, value) => {
    store[key] = value;
  }),
  getItem: jest.fn(async (key) => (key in store ? store[key] : null)),
  removeItem: jest.fn(async (key) => {
    delete store[key];
  }),
  clear: jest.fn(async () => {
    Object.keys(store).forEach((key) => delete store[key]);
  }),
  __resetMockStorage: () => {
    Object.keys(store).forEach((key) => delete store[key]);
  },
  __seedMockStorage: (values) => {
    Object.entries(values).forEach(([key, value]) => {
      store[key] = value;
    });
  },
  __getMockStorage: () => ({ ...store }),
};

export default AsyncStorage;
