// export const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
//     const paddingToBottom = 10;
//     return layoutMeasurement.height + contentOffset.y >=
//       contentSize.height - paddingToBottom;
// };

export const isCloseToBottom = (target) => {
  if (target) {
      const paddingToBottom = 10;
      return target.scrollHeight - target.scrollTop <= target.clientHeight + paddingToBottom;
  }
  return false;
};