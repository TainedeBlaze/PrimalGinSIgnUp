export type GalleryImage = {
  _key?: string;
  asset: {
    _id?: string;
    url: string;
    metadata?: {
      lqip: string;
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
  buttonText?: string;
  gallery: GalleryImage[];
};

