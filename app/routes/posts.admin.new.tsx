import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createPost } from "~/models/post.server";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

   const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    return json(errors);
  }

  if (typeof title !== "string") {
    throw new Error(`Expected title to be a string, got ${title}`);
  
    }
    if (typeof slug !== "string") {
    throw new Error(`Expected slug to be a string, got ${slug}`);
    }
    if (typeof markdown !== "string") {
    throw new Error(`Expected markdown to be a string, got ${markdown}`);
    }


  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};

export default function NewPost() {
      const errors = useActionData<typeof action>();
 const navigation = useNavigation();
  const isCreating = Boolean(
    navigation.state === "submitting"
  );

  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
            {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          <input
            type="text"
            name="slug"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown: </label>
         {errors?.markdown ? (
            <em className="text-red-600">
              {errors.markdown}
            </em>
          ) : null}
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
                  disabled={isCreating}

          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          {isCreating ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
