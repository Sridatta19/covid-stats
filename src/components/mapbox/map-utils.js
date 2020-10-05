import { getShortMonth } from "@utils/fn-utils"

export const getPopupDescription = (
  description,
  totalCases,
  date,
  cases
) => `<div class="text-block">
    <p class="text-head">${description}</p>
    <div class="flex-block">
    <div class="mr-4">
        <p class="text-desc">Total</p>
        <p class="text-value">${totalCases}</p>
    </div> 
    <div>
        <p class="text-desc">${getShortMonth(date)}</p>
        <p class="text-value">${cases}</p>
    </div> 
    </div>
</div>`
