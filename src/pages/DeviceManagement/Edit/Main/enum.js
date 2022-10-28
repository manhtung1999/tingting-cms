export const ActionType = [
    // actionType
    'LOGIN',
    'TRANSFER',
    'CHECK_BALANCE',
    'CHECK_TRANSACTION',
    'GET_HISTORY',
    'RELOAD_HISTORY',
];

export const ManipulationType = [
    // manipulationType
    'TOUCH',
    'SCROLL',
    'FILL_TEXT',
    'CHECK_TRANSACTION',
    'GET_INFO',
    'CHECK_NOTIFICATION',
];

export const ScrollDirection = [
    // ScrollDirection
    'UP',
    'DOWN',
    'LEFT',
    'RIGHT',
];

export const FillTextType = [
    // FillTextType
    'BANK_ACCOUNT',
    'PASSWORD',
    'MONEY',
    'CONTENT',
    'BANK_NAME',
    'LOGIN_PASSWORD',
    'LOGIN_ACCOUNT',
    'OTP',
    'PASSWORD_OTP',
];
//{
// actionType: ActionType,
// manipulations : [
// {
// manipulationType: ManipulationType,
// infos: [ManipulationInfo],
// delay: 2000ms
// scrollDirection: ScrollDirection
// fillTextType: FillTextType
// }
// ]
//}

// {
// "actionType": "LOGIN",
// "manipulations": [
// {
// "manipulationType": "TOUCH",
// "infos": [
//     {
//         "text": "1234",
//         "viewId": "1234",
//         "hint": "1234",
//         "bounds": "12.0, 12.0, 12.0, 12.0",
//         "description": "123",
//         "pattern": "123",
//         "transactionFieldIndex": "123",
//         "parentCount": "123",
//         "childIndexes": "1,3,4,5"
//     }
// ],
// "delay": 2000,
// "scrollDirection": "DOWN"
// "fillTextType": "BANK_ACCOUNT"
// }
// ]
// }

// data class ManipulationInfo(
//     @SerializedName("text")
//     var text: String? = null,
//     @SerializedName("viewId")
//     var viewId: String? = null,
//     @SerializedName("hint")
//     var hint: String? = null,
//     @SerializedName("bounds")
//     var bounds: String? = null,
//     @SerializedName("description")
//     var description: String? = null,
//     @SerializedName("pattern")
//     var pattern: String? = null,
//     @SerializedName("transactionFieldIndex")
//     var transactionFieldIndex: String? = null,
//     @SerializedName("parentNode")
//     var parentCount: String? = null,
//     @SerializedName("childIndexes")
//     var childIndexes: String? = null
// ) {
//     fun getBound() : Bound? {
//         val list = bounds?.split(",") ?: return null
//         return Bound(list[0].toFloat(), list[1].toFloat(), list[2].toFloat(), list[3].toFloat())
//     }
//     fun getRect() : Rect {
//         val list = bounds?.split(",") ?: return Rect(0,0,0,0)
//         return Rect(list[0].toInt() ?: 0, list[1].toInt() ?: 0, list[2].toInt() ?: 0, list[3].toInt() ?: 0)
//     }
//     fun getTransactionFieldIndex(): Int? {
//         return transactionFieldIndex?.toInt()
//     }
//     fun getParentCount(): Int? {
//         return parentCount?.toInt()
//     }
//     fun getChildIndexes(): MutableList<Int> {
//         return childIndexes?.split(",")?.map { it.toInt() } as MutableList<Int>? ?: ArrayList()
//     }
//     fun isMatch(node: AccessibilityNodeInfo?): Boolean {
//         val textMatch = if (text.isNullOrEmpty()) true else text == node?.text?.toString()
//         val viewIdMatch =
//             if (viewId.isNullOrEmpty()) true else viewId == node?.viewIdResourceName?.toString()
//         val hintMatch = if (hint.isNullOrEmpty()) true else hint == node?.hintText?.toString()
//         val descriptionMatch = if (description.isNullOrEmpty()) {
//             true
//         } else {
//             description == node?.contentDescription?.toString()
//         }
//         return textMatch && viewIdMatch && hintMatch && descriptionMatch
//     }
// }
