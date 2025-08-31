import { caller } from '@/utils/trpc-ssc'

export default async function Home() {
  console.log("hello world");
  const postList = await caller.post.list();

  return (
    <div>
      <div>ssc page</div>
      {postList.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
      <button>add post</button>
    </div>
  );
}
