import Head from 'next/head'

const Meta = ({ title, keywords, description }) => {
    return (
        <Head>
            <meta name='viewport' content='width=device-width,initial-scale=1' />
            <meta name='keywords' content={keywords} />
            <meta name='description' content ={description} />
            <meta charSet='utf-8' />
            <link rel='icon' href='/images/Logo.jpg' />
            <title>{title}</title>
        </Head>
    )
}

Meta.defaultProps = {
    title: 'World In 2021',
    keywords: 'world, 2021, website, advertising',
    description: 'World In 2021 is created for bring together variety of websites of 2021 at one virtual place'
}

export default Meta