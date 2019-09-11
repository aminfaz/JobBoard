const data = require('../startup/data');
const axios = require('axios');
const config = require('config');

jest.mock('axios');

describe('data loader', () => {
  const pool = {
    query: null
  };

  config.get = jest.fn().mockReturnValue('mocked value');

  axios.get = jest.fn().mockResolvedValue({
    data: `job title,job description,date,location,applicants
      Superstar Barhand Staff,Superstar Barhand Staff,10/08/2019,Melbourne,"tom, jacqui, luke, kate"
      Exceptional Wait staff la carte,Exceptional Wait staff la carte,11/08/2019,Sydney,"tom, jacqui"
      Superstar Bar Staff,Superstar Bar Staff,12/08/2019,Perth,kate
      Forklift driver,Forklift driver,13/08/2019,Brisbane,luke`
  });

  beforeEach(() => {
    pool.query = jest.fn();
  });

  it('If data is previously loaded should skip', () => {
    pool.query.mockReturnValue([{ total: 10 }]);
    data(pool);
    expect(pool.query.mock.calls.length).toBe(1);
    expect(pool.query.mock.calls[0][0]).toBe(
      'SELECT COUNT(*) AS total FROM jobs'
    );
  });

  it('If data is NOT previously loaded should load', () => {
    pool.query
      .mockImplementationOnce([{ total: 0 }]);
    data(pool);
    expect(pool.query.mock.calls.length).toBe(1);
    expect(pool.query.mock.calls[0][0]).toBe(
      'SELECT COUNT(*) AS total FROM jobs'
    );
  });
});
