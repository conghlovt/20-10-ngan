import { PhotoItem } from '../types/photo';

const PHOTO_MESSAGES = [
  {
    "caption": "Khoảnh khắc ngọt ngào #1",
    "subCaption": "Chúc Cậu luôn giữ nụ cười ngọt ngào và thật nhiều niềm vui 🌸"
  },
  {
    "caption": "Ấm áp bên nhau #2",
    "subCaption": "Mãi bên nhau ấm áp như chiếc khăn mùa thu ✨"
  },
  {
    "caption": "Bông hoa tặng Cậu #3",
    "subCaption": "Nụ cười của Cậu luôn rạng rỡ như đóa hoa tươi thắm 🌷"
  },
  {
    "caption": "Câu chuyện đôi mình #4",
    "subCaption": "Mỗi ngày bên Cậu đều là một trang kỷ niệm đáng yêu 💖"
  },
  {
    "caption": "Niềm vui nhỏ xíu #5",
    "subCaption": "Chúc Cậu ngày 20/10 luôn tràn ngập tiếng cười 🌼"
  },
  {
    "caption": "Mãi luôn hạnh phúc #6",
    "subCaption": "Chúc Cậu gặp thật nhiều may mắn và luôn xinh đẹp ✨"
  },
  {
    "caption": "Công chúa ngày 20/10 #7",
    "subCaption": "Hôm nay Cậu là người xinh đẹp và rạng rỡ nhất 👑"
  },
  {
    "caption": "Bay cao ước mơ #8",
    "subCaption": "Mọi điều ước của Cậu đều sẽ thành hiện thực 🎈"
  },
  {
    "caption": "Ngôi sao may mắn #9",
    "subCaption": "Chúc Cậu một ngày 20/10 trọn vẹn yêu thương 🌟"
  }
];

export const DEFAULT_PHOTOS: PhotoItem[] = PHOTO_MESSAGES.map((message, index) => ({
  id: `memory-${index + 1}`,
  url: `/photos/memory-${index + 1}.jpg`,
  ...message,
  isEmpty: false,
}));
