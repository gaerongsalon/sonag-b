import { notifications } from "@mantine/notifications";

export default async function promiseNotification<R>(
  promise: Promise<R>,
  {
    buildSuccessMessage = () => `작업을 완료했습니다!`,
    buildFailedMessage = () => "작업이 실패했습니다.",
    onSuccess = () => {},
    onFailed = () => {},
  }: {
    buildSuccessMessage?: (result: R) => string | null;
    buildFailedMessage?: (error: unknown) => string | null;
    onSuccess?: (result: R) => void;
    onFailed?: (error: unknown) => void;
  } = {}
): Promise<R | null> {
  try {
    const result = await promise;
    onSuccess(result);

    const successMessage = buildSuccessMessage(result);
    if (successMessage !== null) {
      notifications.show({
        title: "Success",
        message: buildSuccessMessage(result),
        color: "blue",
      });
    }
    return result;
  } catch (error) {
    onFailed(error);
    console.error({ error }, "Cannot resolve promise");

    const failedMessage = buildFailedMessage(error);
    if (failedMessage !== null) {
      notifications.show({
        title: "Failed",
        message: buildFailedMessage(error),
        color: "red",
      });
    }
    return null;
  }
}
