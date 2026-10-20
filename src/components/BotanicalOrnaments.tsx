import porcelainBranch from '../assets/porcelain-branch.svg';

export function BotanicalOrnaments() {
  return (
    <div className="botanical-frame" aria-hidden="true">
      <img className="botanical botanical-top" src={porcelainBranch} alt="" />
      <img className="botanical botanical-bottom" src={porcelainBranch} alt="" />
    </div>
  );
}
