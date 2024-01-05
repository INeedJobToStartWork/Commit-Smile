import jiti from "jiti";

export const readConfig = async (configPath: string): Promise<Record<string, unknown>> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let result: { default: Record<string, unknown> } = await jiti(process.cwd(), {
    cache: true,
    debug: process.env.DEBUG === "TRUE"
  })(configPath);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return result.default ?? result;
};
export default readConfig;
