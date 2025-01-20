import frequest from "./services/handler";
import exhibit from "./services/api/modules/exhibit";

const name = "freelog-library";
export async function getExhibitDepFileStream(
  exhibitId: string | number,
  query: {
    nid: string | number;
    returnUrl?: boolean;
    subFilePath?: string;
    config?: any;
  }
) {
  return frequest.bind({
    name,
    isAuth: true,
    exhibitId: exhibitId,
  })(
    query?.subFilePath
      ? exhibit.getExhibitDepInsideById
      : exhibit.getExhibitDepById,
    // @ts-ignore
    [exhibitId, query.nid, query?.subFilePath],
    null,
    query?.returnUrl,
    query?.config
  );
}

