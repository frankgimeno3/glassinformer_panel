export interface articleInterface {
  id_article: string;
  articleTitle: string;
  articleSubtitle: string;
  article_main_image_url: string;
  article_tags_array: string[];
  contents_array: string[];
  company: string;    
  date: string;     
}
export interface articleMiniatureInterface {
    contenidoTitulo: string,
    contenidoSubtitulo: string,
    url_imagen: string
}

export interface publicationInterface {
  id_publication: string;
  publicationTitle: string;
  publicationName: string;
  date: string;
  revista: string;
  edición: string;
  número: number | string;
  tags: string[];
}