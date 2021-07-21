import tableStyles from "../styles/table.module.css"
import utilStyles from "../styles/utils.module.css"

export function JoinUs() {

    return <div id={tableStyles.rightSide}>
    <div className={tableStyles.description}>
        <span>In year 2021, the world is still fighting COVID-19. Because of the virus, every day we are finding creative ways,
        faster than ever before, to make our lives better using digital technologies. Here can be found up to milion websites of people
        who want to share something we can all enjoy and something that will make 2021 remembered by.
        </span>
        <br/>
        <span>If you want to promote what you are doing, pick a suitable shop and show us what you got!</span>
    </div>
    <span className={utilStyles.footnote}>*This site does not promote webpages with adult, disturbing, offensive or any kind of inappropriate content</span>

    </div>
}