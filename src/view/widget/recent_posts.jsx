/**
 * Recent posts widget JSX component.
 * @module view/widget/recent_posts
 */
const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const ArticleMedia = require('hexo-component-inferno/lib/view/common/article_media');

/**
 * Recent posts widget JSX component.
 *
 * @example
 * <RecentPosts
 *     title="Widget title"
 *     posts={[
 *         {
 *             url: '/url/to/post',
 *             title: 'Post title',
 *             date: '******',
 *             dateXml: '******',
 *             thumbnail: '/path/to/thumbnail',
 *             categories: [{ name: 'Category name', url: '/path/to/category' }]
 *         }
 *     ]} />
 */
class RecentPosts extends Component {
  render() {
    const { title, posts, counter} = this.props;

    return (
      <div class="card widget" data-type="recent-posts">
        <div class="card-content">
			<nav class="level is-mobile">
				<div class="level-item has-text-centered is-marginless">
					<div>
						<p class="heading">{counter.post.title}</p>
						<a href={counter.post.url}>
							<p class="title">{counter.post.count}</p>
						</a>
					</div>
				</div>
				<div class="level-item has-text-centered is-marginless">
					<div>
						<p class="heading">{counter.category.title}</p>
						<a href={counter.category.url}>
							<p class="title">{counter.category.count}</p>
						</a>
					</div>
				</div>
				<div class="level-item has-text-centered is-marginless">
					<div>
						<p class="heading">{counter.tag.title}</p>
						<a href={counter.tag.url}>
							<p class="title">{counter.tag.count}</p>
						</a>
					</div>
				</div>
			</nav>
          <h3 class="menu-label">{title}</h3>
          {posts.map((post) => {
            return (
              <ArticleMedia
                thumbnail={post.thumbnail}
                url={post.url}
                title={post.title}
                date={post.date}
                dateXml={post.dateXml}
                categories={post.categories}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

/**
 * Cacheable recent posts widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <RecentPosts.Cacheable
 *     site={{ posts: {...} }}
 *     helper={{
 *         url_for: function() {...},
 *         __: function() {...},
 *         date_xml: function() {...},
 *         date: function() {...}
 *     }}
 *     limit={5} />
 */
RecentPosts.Cacheable = cacheComponent(RecentPosts, 'widget.recentposts', (props) => {
  const { site, helper, limit = 5 } = props;
  const { url_for, __, date_xml, date, _p } = helper;
  
  const postCount = site.posts.length;
  const categoryCount = site.categories.filter(category => category.length).length;
  const tagCount = site.tags.filter(tag => tag.length).length;
 
  if (!site.posts.length) {
    return null;
  }
  const posts = site.posts
    .sort('date', -1)
    .limit(limit)
    .map((post) => ({
      url: url_for(post.link || post.path),
      title: post.title,
      date: date(post.date),
      dateXml: date_xml(post.date),
      thumbnail: post.thumbnail ? url_for(post.thumbnail) : null,
      categories: post.categories.map((category) => ({
        name: category.name,
        url: url_for(category.path),
      })),
    }));
  return {
    posts,
    title: __('widget.recents'),
    counter: {
            post: {
                count: postCount,
                title: _p('common.post', postCount),
                url: url_for('/archives')
            },
            category: {
                count: categoryCount,
                title: _p('common.category', categoryCount),
                url: url_for('/categories')
            },
            tag: {
                count: tagCount,
                title: _p('common.tag', tagCount),
                url: url_for('/tags')
            }
        },
  };
});

module.exports = RecentPosts;
