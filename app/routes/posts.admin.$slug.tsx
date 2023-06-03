import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { marked } from "marked"
import invariant from "tiny-invariant";
import { deletePost, getPost } from "~/models/post.server"

export const loader = async ({ params }: LoaderArgs) => {
      invariant(params.slug, `params.slug is required`);
    if (!params.slug) {
        return redirect("/posts");
    }
    const post = await getPost(params.slug);
      invariant(post, `Post not found: ${params.slug}`);

    const html = marked(post.markdown);
  return json({ html, post });
};

export async function action({ params, request }:ActionArgs) {
    
    const {slug} = params

    if (!slug) {
        return
    }
 await deletePost(slug)
        return redirect("/posts/admin")
}

    

export default function PostSlug() {
      const {post, html } = useLoaderData<typeof loader>();


  return (
    <main className="mx-auto max-w-4xl">
       <form method="post">
        <button name="delete" type="submit" value="delete">
        Delete
        </button>
        </form>
        <Link to={`/posts/admin/edit/${post.slug}`}>
        Edit
        </Link>
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {post?.title}
      </h1>
         <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
