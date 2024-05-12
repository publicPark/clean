import stylesPaper from "../styles/Paper.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import Clock from "./Clock";
import Invitations from "./Invitations";
import NewPlaces from "./NewPlaces";
import MyNews from "./MyNews";
import News from "./News";
import SettingLang from "./SettingLang";

const Dashboard = ({}) => {
  const { currentUser, userDetail } = useAuth();

  return (
    <div className={stylesPaper.Flex}>
      {!currentUser && (
        <div className={stylesPaper.Wrapper}>
          <div className={stylesPaper.Content}>
            <Clock />
          </div>
          <hr />
          <div className={stylesPaper.Content}>
            <SettingLang />
          </div>
        </div>
      )}

      {currentUser && <Invitations />}
      <NewPlaces />

      {currentUser && <MyNews />}
      {/* currentUser && userDetail && userDetail.tester && */}

      {!currentUser && (
        <div className={stylesPaper.Wrapper}>
          <div className={stylesPaper.Content}>
            <News />
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
