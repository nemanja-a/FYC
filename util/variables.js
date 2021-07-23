export const ROWS_PER_PAGE = 14
export const COLUMNS_PER_ROW = 19
export const TOTAL_PAGE_COUNT = 3333
export const NAVIGATION_BUTTONS_COUNT = 5
export const DEFAULT_MODAL_WEBSITE_IMAGE = 'https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png'

export const WEBSITE = { 
    TITLE_MAX_LENGTH: 40,
    DESCRIPTION_MAX_LENGTH: 70,
    THUMBNAIL: {
        DEFAULT: '/images/Logo.jpg',
        NO_IMAGE_FOUND: '/images/no-image-found-360x260.png'
    },
    DEFAULT: {
        url: '',
        title: 'Website title',
        titleOpacity: 10,
        titleColor: "#fff",
        titleBackgroundColor: "#ffaa4e",
        titlePosition: 0,
        DescriptionHeight: 19,
        description: 'Website description',
        descriptionOpacity: 10,
        descriptionColor: "#fff",
        descriptionBackgroundColor: "#ffaa4e",
        descriptionPosition: 89,
        DescriptionHeight: 19,
        image: null,
        thumbnail: { url: '/images/Logo.jpg' },
        imageWidth: 0,
        imageHeight: 0
    }
}

export const ALLOWED_FORMATS = 'image/jpeg, image/jpg, image/png'

export const REFERER_HEADER_MAX_LENGTH = 2083