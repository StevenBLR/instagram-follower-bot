import {
  IgApiClient,
  MediaRepositoryLikersResponseUsersItem,
} from "instagram-private-api";
import { config } from "dotenv";
export default class BotService {
  ig: IgApiClient;
  user: string;
  password: string;
  accountToParse: string = "theuniversalart";
  usersToFollow: MediaRepositoryLikersResponseUsersItem[];
  constructor() {
    config();
    this.user = process.env.IG_USERNAME;
    this.password = process.env.IG_PASSWORD;
    this.ig = new IgApiClient();
  }

  async run() {
    const getWaitTime = () =>
      Math.random() * 5 * 10000 - Math.random() * 1 * 10000;
    await this.getSavedPosts();
    setInterval(async () => {
      // Process Ajout followers selon derniers likes
      // if (!this.usersToFollow || this.usersToFollow.length < 1) {
      //     console.log('getting latest post likers');
      //     await this.getLatestPostLikers();
      // } else {
      //     console.log('we have ' + this.usersToFollow.length + ' users we can follow');
      //     let user = this.usersToFollow.pop();
      //     while (user.is_private) {
      //         user = this.usersToFollow.pop();
      //     }
      //     console.log('attempting to following user: ', user.username);
      //     await this.follow(user.pk);
      // }
    }, getWaitTime());
  }

  // async follow(userId: number) {
  //     await this.ig.friendship.create(userId);
  // }

  // async getLatestPostLikers() {
  //     const id = await this.ig.user.getIdByUsername(this.accountToParse);
  //     const feed = await this.ig.feed.user(id);
  //     const posts = await feed.items();
  //     this.usersToFollow = await (await this.ig.media.likers(posts[0].id)).users;
  // }

  async getSavedPosts() {
    const id = await this.ig.user.getIdByUsername(this.user);
    console.log(id);
    const feed = await this.ig.feed.user(id);
    console.log(feed);
    const acfolo = await this.ig.feed.accountFollowing();
    console.log(acfolo);
    // feed.items() --> Posts de l'utilisateur
    const savedPosts = await this.ig.feed.saved().items();
    const likedPosts = await this.ig.feed.liked().items();

    console.log(
      `==============================\n LIKED POSTS \n==============================`
    );
    let likedPostsCount = 0;
    likedPosts.forEach((n) => {
      console.log(n.user.full_name);
      console.log(n.caption?.text);
      console.log(
        "----------------------------------------------------------------------"
      );
      likedPostsCount++;
    });
    console.log(`Nombre de posts sauvegardés = ${likedPostsCount}`);

    console.log(
      `==============================\n SAVED POSTS \n==============================`
    );

    let savedPostsCount = 0;
    savedPosts.forEach((n) => {
      console.log(n.user?.full_name);
      console.log(n.caption?.text);
      console.log(
        "----------------------------------------------------------------------"
      );
      savedPostsCount++;
    });
    console.log(`Nombre de posts sauvegardés = ${savedPostsCount}`);
  }

  async login() {
    this.ig.state.generateDevice(this.user);
    await this.ig.simulate.preLoginFlow();
    const loggedInAccount = await this.ig.account.login(
      this.user,
      this.password
    );
    await this.ig.simulate.postLoginFlow();
    console.log("logged in..");
    //Informations generales compte --> console.table(loggedInAccount);
  }
}
