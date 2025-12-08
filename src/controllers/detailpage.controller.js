import { extractDetailpage } from '../extractor/extractDetailpage.js';
import { axiosInstance } from '../services/axiosInstance.js';
import { validationError } from '../utils/errors.js';
import { withCache } from '../utils/redis.js';

const detailpageController = async (c) => {
  const id = c.req.param('id');

  return await withCache(
    `anime:${id}`,
    async () => {
      const result = await axiosInstance(`/${id}`);
      if (!result.success) {
        throw new validationError(result.message, 'maybe id is incorrect : ' + id);
      }
      return extractDetailpage(result.data);
    },
    60 * 60 * 24
  );
};

export default detailpageController;
