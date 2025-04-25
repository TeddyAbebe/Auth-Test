import ContentList from "../components/ContentList";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <ContentList />
      </div>
    </div>
  );
}
