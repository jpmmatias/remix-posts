import { json } from "@remix-run/node";
import { Link, Links, useLoaderData } from '@remix-run/react'
import { getPosts } from "~/models/post.server";

export const loader = async () => {
return json({
    posts: await getPosts()
})
};

export default function Posts() {
     const { posts } = useLoaderData<typeof loader>();

    return <main>
        <Link to='admin'>Admin</Link>
         <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li  key={post.slug}>
            <Link
              to={post.slug}
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
}