import { BookmarkIcon, GinkgoLeaf } from '../components/Icons'
import { Stamp } from '../components/Stamp'
import { EXPERIENCES } from '../data/experiences'
import { useStudy } from '../store/StudyContext'

export function ExperiencePage() {
  const { state, toggleBookmark } = useStudy()

  return (
    <div className="page experience-page">
      <header className="page-head">
        <div>
          <h1 className="page-title">备考经验</h1>
          <p className="page-sub">三张手账卡，随时翻看</p>
        </div>
        <Stamp small />
      </header>

      <div className="exp-intro">
        <GinkgoLeaf size={16} />
        <span>收藏后会保存在本机，方便随时回看。</span>
      </div>

      <div className="exp-list">
        {EXPERIENCES.map((card) => {
          const active = state.bookmarks.includes(card.id)
          return (
            <article className="card exp-card" key={card.id}>
              <div className="exp-top">
                <div className="exp-heading">
                  <div className="exp-tags">
                    {card.tags.map((tag) => (
                      <span className="exp-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="exp-title">{card.title}</h2>
                </div>
                <button
                  type="button"
                  className={active ? 'bookmark-btn is-active' : 'bookmark-btn'}
                  onClick={() => toggleBookmark(card.id)}
                  aria-pressed={active}
                  aria-label={active ? '取消收藏' : '收藏这张卡片'}
                >
                  <BookmarkIcon filled={active} />
                </button>
              </div>
              <ul className="exp-points">
                {card.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>

      <p className="exp-foot">本轮只做方法卡与收藏，不含评论与社区。</p>
    </div>
  )
}
