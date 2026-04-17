import Container from './Container'
const Favour = ({ favour, toggleFavour }) => {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-5">My Favorites</h1>

      {favour.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        <div className="flex gap-10 flex-wrap">
          {favour.map((ele) => (
            <Container
              key={ele.id}
              ele={ele}
              favour={favour}
              toggleFavour={toggleFavour}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Favour;