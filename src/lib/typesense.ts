import { Client } from 'typesense';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';

const defaultPerPage = 250;

interface Collection {
  name: string;
  fields: Field[];
  numDocuments: number;
}

interface Field {
  name: string;
  type: string;
}

interface ShakespeareWorks {
  id: string;
  title: string;
}

interface SearchResult {
  play: Play;
  characters: Character[];
  acts: Act[];
  scenes: Scene[];
  speeches: Speech[];
  found: number;
  page: number;
  total_pages: number;
}

interface Speech {
  id: string;
  scene_id: string;
  speaker: string;
  content: string;
}

interface Scene {
  id: string;
  act_id: string;
  play_id: string;
  title: string;
}

interface Act {
  id: string;
  play_id: string;
  title: string;
}

interface Character {
  id: string;
  play_id: string;
  name: string;
  group_description?: string;
  individual_description?: string;
}

interface Play {
  id: string;
  title: string;
  playsubt?: string;
  fm?: string;
  scndescr?: string;
}

interface TypesenseSearchResult<T> {
  hits?: Array<{ document: T }>;
  found?: number;
  page?: number;
}

class TypesenseClient {
  private client: Client;

  constructor(apiKey: string | undefined, host: string | undefined) {
    if (!apiKey || !host) {
      throw new Error('Typesense API key and host are required');
    }

    this.client = new Client({
      nodes: [{ host, port: 443, protocol: 'https' }],
      apiKey,
    });
  }

  async getShakespeareWorks(): Promise<ShakespeareWorks[]> {
    const searchParameters: SearchParams = {
      q: '*',
      query_by: 'title',
      per_page: defaultPerPage,
    };

    try {
      const searchResult = await this.client.collections('plays').documents().search(searchParameters);
      return searchResult.hits?.map(hit => hit.document as ShakespeareWorks) || [];
    } catch (error) {
      throw new Error(`Error searching shakespeare_works collection: ${error}`);
    }
  }

  async searchSpeeches(playId: string, searchText: string, page: number = 1, perPage: number = defaultPerPage): Promise<SearchResult> {
    try {
      // Fetch play details
      const playResult = await this.getRelatedDocuments<Play>('plays', [playId]);
      if (playResult.length === 0) {
        throw new Error(`Play with id ${playId} not found`);
      }
      const play = playResult[0];

      // Fetch characters
      const charactersResult = await this.client.collections('characters').documents().search({
        q: '*',
        filter_by: `play_id:${playId}`,
        per_page: defaultPerPage,
      }) as TypesenseSearchResult<Character>;

      // Fetch acts
      const actsResult = await this.client.collections('acts').documents().search({
        q: '*',
        filter_by: `play_id:${playId}`,
        per_page: defaultPerPage,
      }) as TypesenseSearchResult<Act>;

      // Fetch scenes for the play (with pagination)
      let allScenes: Scene[] = [];
      let scenePage = 1;
      let totalScenes = 0;

      do {
        const scenesResult = await this.client.collections('scenes').documents().search({
          q: '*',
          filter_by: `act_id:=[${actsResult.hits?.map(hit => hit.document.id).join(',')}]`,
          per_page: defaultPerPage,
          page: scenePage,
        }) as TypesenseSearchResult<Scene>;

        allScenes = allScenes.concat(scenesResult.hits?.map(hit => hit.document) || []);
        totalScenes = scenesResult.found || 0;
        scenePage++;
      } while (allScenes.length < totalScenes);

      // Get all scene IDs
      const sceneIds = allScenes.map(scene => scene.id);

      // Search speeches using the scene IDs
      const speechesResult = await this.client.collections('speeches').documents().search({
        q: searchText,
        query_by: 'content',
        filter_by: `scene_id:=[${sceneIds.join(',')}]`,
        per_page: perPage,
        page: page,
      }) as TypesenseSearchResult<Speech>;

      const speeches = speechesResult.hits?.map(hit => hit.document) || [];
      const found = speechesResult.found || 0;
      const total_pages = Math.ceil(found / perPage);

      return {
        play: play,
        characters: charactersResult.hits?.map(hit => hit.document) || [],
        acts: actsResult.hits?.map(hit => hit.document) || [],
        scenes: allScenes,
        speeches: speeches,
        found: found,
        page: page,
        total_pages: total_pages,
      };
    } catch (error) {
      throw new Error(`Error searching play data: ${error}`);
    }
  }

  private async getRelatedDocuments<T>(collection: string, ids: string[], idField: string = 'id'): Promise<T[]> {
    if (ids.length === 0) return [];
  
    try {
      const result = await this.client.collections(collection).documents().search({
        q: '*',
        filter_by: `${idField}:=[${ids.join(',')}]`,
        per_page: ids.length,
      }) as TypesenseSearchResult<T>;
      return result.hits?.map(hit => hit.document) || [];
    } catch (error) {
      console.error(`Error fetching related documents from ${collection}:`, error);
      return [];
    }
  }

  async getCollections(): Promise<Collection[]> {
    try {
      const collections = await this.client.collections().retrieve();
      const result: Collection[] = [];

      for (const c of collections) {
        const fields: Field[] = c.fields?.map(f => ({ name: f.name, type: f.type })) || [];
        const collectionInfo = await this.client.collections(c.name).retrieve();

        result.push({
          name: c.name,
          fields,
          numDocuments: collectionInfo.num_documents ?? 0,
        });
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to retrieve collections: ${error}`);
    }
  }

  async getCollectionData(collectionName: string): Promise<string> {
    const searchParameters: SearchParams = {
      q: '*',
      query_by: '',
      per_page: defaultPerPage,
      page: 1,
    };

    try {
      const searchResult = await this.client.collections(collectionName).documents().search(searchParameters);
      return JSON.stringify(searchResult.hits || [], null, 2);
    } catch (error) {
      throw new Error(`Failed to search collection: ${error}`);
    }
  }
}

let typesenseClient: TypesenseClient | null = null;

function getTypesenseClient(): TypesenseClient {
  if (!typesenseClient) {
    const apiKey = import.meta.env.VITE_TYPESENSE_API_KEY;
    const host = import.meta.env.VITE_TYPESENSE_HOST;

    if (!apiKey || !host) {
      throw new Error('Typesense API key and host are not set in environment variables');
    }

    typesenseClient = new TypesenseClient(apiKey, host);
  }

  return typesenseClient;
}

export type { Collection, Field, ShakespeareWorks, SearchResult, Speech, Scene, Act, Character, Play };
export const getShakespeareWorks = () => getTypesenseClient().getShakespeareWorks();
export const getCollections = () => getTypesenseClient().getCollections();
export const getCollectionData = (collectionName: string) => getTypesenseClient().getCollectionData(collectionName);
export const searchSpeeches = (playId: string, searchText: string, page?: number, perPage?: number) => 
  getTypesenseClient().searchSpeeches(playId, searchText, page, perPage);
export { TypesenseClient };