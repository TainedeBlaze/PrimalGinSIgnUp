import { defineType } from 'sanity';

export default defineType({
  name: 'emailSignupPage',
  title: 'Email Signup Page',
  type: 'document',
 
  description: 'There can only be one Email Signup Page document.',
  fields: [
    {
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        placeholder: 'Get Exclusive Primal Gin Offers',
      },
    },
    {
      name: 'subheading',
      title: 'Page Subheading',
      type: 'string',
      options: {
        placeholder: 'Sign up to receive the latest news, launches, and special deals from Primal Gin.',
      },
    },
    {
      name: 'gallery',
      title: 'Background Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: Rule => Rule.min(1),
    },
  ],
}); 