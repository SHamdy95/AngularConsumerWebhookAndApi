export interface UmbracoContent {
  id: string;
  name: string;
  contentType: string;
  createDate: string;
  updateDate: string;
  route: { path: string; startItem: { id: string; path: string } };
  properties: Record<string, any>;
  cultures: Record<string, { path: string }>;
}

export interface UmbracoPagedResult {
  total: number;
  items: UmbracoContent[];
}

export interface UmbracoMedia {
  id: string;
  name: string;
  mediaType: string;
  url: string;
  extension: string;
  width?: number;
  height?: number;
  properties: Record<string, any>;
}

export interface UmbracoQuery {
  fetch?: string;        // 'children:/blog' | 'descendants:{id}' | 'ancestors:{id}'
  filter?: string[];     // ['contentType:article', 'name:news']
  sort?: string[];       // ['createDate:desc', 'sortOrder:asc']
  skip?: number;
  take?: number;
  expand?: string;       // 'properties[$all]'
  fields?: string;       // 'properties[title,summary]'
}