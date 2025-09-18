interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => (
  <div>
    <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">{title}</h1>
    <p className="text-white mt-4">Halaman ini sedang dalam pengembangan.</p>
  </div>
);

export default PlaceholderPage;