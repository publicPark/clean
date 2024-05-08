import stylesPaper from "../styles/Paper.module.scss";
import ProfileForm from "../Form/ProfileForm";
import Places from "../List/Places";
import PlaceButtons from "../Dashboard/PlaceButtons";

const Profile = () => {
  return (
    <div className={stylesPaper.Flex}>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <ProfileForm />
        </div>
      </div>

      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>내 모든 구역들</h2>
          <PlaceButtons />
        </div>
        <Places />
      </div>
    </div>
  );
};

export default Profile;
