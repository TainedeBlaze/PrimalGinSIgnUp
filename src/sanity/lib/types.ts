export type GalleryImage = {
  _key?: string;
  asset: {
    _id?: string;
    url: string;
    metadata?: {
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
};

export type EmailSignupPage = {
  heading?: string;
  subheading?: string;
  gallery: GalleryImage[];
};

