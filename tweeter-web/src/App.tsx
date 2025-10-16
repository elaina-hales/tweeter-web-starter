import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { User, Status } from "tweeter-shared";
import { PageItemView } from "./presenter/PageItemPresenter";
import { ItemScroller } from "./components/mainLayout/ItemScroller";
import { StatusService } from "./model.service/StatusService";
import StatusItem from "./components/statusItem/StatusItem";
import { FollowService } from "./model.service/FollowService";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={<ItemScroller<Status, StatusService> 
          key={`feed-${displayedUser!.alias}`} featureUrl="/feed" 
          presenterFactory={(view: PageItemView<Status>) => new FeedPresenter(view)} 
          itemFactory={(item: Status, featureUrl: string) => (<StatusItem featureURL={featureUrl} status={item}/>)}/>} />
        <Route path="story/:displayedUser" element={<ItemScroller<Status, StatusService> 
          key={`story-${displayedUser!.alias}`} featureUrl="/story"
          presenterFactory={(view: PageItemView<Status>) => new StoryPresenter(view)} 
          itemFactory={(item: Status, featureUrl: string)=> (<StatusItem featureURL={featureUrl} status={item}/>)}/>} />
        <Route path="followees/:displayedUser" element={<ItemScroller<User, FollowService>
          key={`followees-${displayedUser!.alias}`} featureUrl="/followees"
          presenterFactory={(view: PageItemView<User>) => new FolloweePresenter(view)} 
          itemFactory={(item: User, featureUrl: string) => (<UserItem user={item} featurePath={featureUrl} />)}/>} />
        <Route path="followers/:displayedUser" element={<ItemScroller<User, FollowService> 
          key={`followers-${displayedUser!.alias}`} featureUrl="/followers"
          presenterFactory={(view: PageItemView<User>) => new FollowerPresenter(view)} 
          itemFactory={(item: User, featureUrl: string)=> (<UserItem user={item} featurePath={featureUrl} />)} />} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname}/>} />
    </Routes>
  );
};

export default App;
