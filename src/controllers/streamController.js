import { validationError } from '../utils/errors.js';
import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';

const streamController = async (c) => {
  let { id, server = 'HD-1', type = 'sub' } = c.req.query();

  if (!id) throw new validationError('id is required');

  server = server.toUpperCase();
  
  const servers = await getServers(id);

  const selectedServer = servers[type].find((el) => el.name === server);
  if (!selectedServer) throw new validationError('invalid or server not found', { server });

  const response = await extractStream({ selectedServer, id });
  return response;
};

export default streamController;
