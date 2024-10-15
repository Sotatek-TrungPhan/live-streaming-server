export const FLEX_MESSAGE = {
  type: 'bubble',
  hero: {
    type: 'image',
    url: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
    size: 'full',
    aspectRatio: '20:13',
    aspectMode: 'cover',
    action: {
      type: 'uri',
      uri: 'https://line.me/',
    },
  },
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'Brown Cafe',
        weight: 'bold',
        size: 'xl',
      },
      {
        type: 'box',
        layout: 'baseline',
        margin: 'md',
        contents: [
          {
            type: 'icon',
            size: 'sm',
            url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png',
          },
          {
            type: 'icon',
            size: 'sm',
            url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png',
          },
          {
            type: 'icon',
            size: 'sm',
            url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png',
          },
          {
            type: 'icon',
            size: 'sm',
            url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png',
          },
          {
            type: 'icon',
            size: 'sm',
            url: 'https://developers-resource.landpress.line.me/fx/img/review_gray_star_28.png',
          },
          {
            type: 'text',
            text: '4.0',
            size: 'sm',
            color: '#999999',
            margin: 'md',
            flex: 0,
          },
        ],
      },
      {
        type: 'box',
        layout: 'vertical',
        margin: 'lg',
        spacing: 'sm',
        contents: [
          {
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                text: 'Place',
                color: '#aaaaaa',
                size: 'sm',
                flex: 1,
              },
              {
                type: 'text',
                text: 'Flex Tower, 7-7-4 Midori-ku, Tokyo',
                wrap: true,
                color: '#666666',
                size: 'sm',
                flex: 5,
              },
            ],
          },
          {
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                text: 'Time',
                color: '#aaaaaa',
                size: 'sm',
                flex: 1,
              },
              {
                type: 'text',
                text: '10:00 - 23:00',
                wrap: true,
                color: '#666666',
                size: 'sm',
                flex: 5,
              },
            ],
          },
        ],
      },
    ],
  },
  footer: {
    type: 'box',
    layout: 'horizontal',
    spacing: 'sm',
    contents: [
      {
        type: 'button',
        style: 'link',
        height: 'sm',
        action: {
          type: 'uri',
          label: 'CALL',
          uri: 'https://line.me/',
        },
      },
      {
        type: 'button',
        style: 'link',
        height: 'sm',
        action: {
          type: 'uri',
          label: 'WEBSITE',
          uri: 'https://line.me/',
        },
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: [],
        margin: 'sm',
      },
    ],
    flex: 0,
  },
};

export const RICH_MENU_IMAGE_SIZE = {
  width: 2500,
  height: 1686,
};
